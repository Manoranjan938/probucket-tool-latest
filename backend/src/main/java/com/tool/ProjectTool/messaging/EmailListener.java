package com.tool.ProjectTool.messaging;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import freemarker.template.Configuration;
import jakarta.mail.internet.MimeMessage;

// Sends the emails from the email queue. Throwing hands the message back for a retry,
// and after the last retry it goes to the dead-letter queue.
@Component
public class EmailListener {

	private static final Logger log = LoggerFactory.getLogger(EmailListener.class);

	private final JavaMailSender mailSender;
	private final Configuration freemarker;
	private final String mailFrom;
	private final String frontendUrl;

	public EmailListener(JavaMailSender mailSender, Configuration freemarker, @Value("${app.mail.from}") String mailFrom,
			@Value("${app.frontend-url}") String frontendUrl) {
		this.mailSender = mailSender;
		this.freemarker = freemarker;
		this.mailFrom = mailFrom;
		this.frontendUrl = frontendUrl;
	}

	@RabbitListener(queues = MessagingConfig.EMAIL_QUEUE)
	public void send(EmailMessage email) throws Exception {

		Map<String, Object> model = new HashMap<>(email.data());
		model.put("frontendUrl", frontendUrl);
		String html = FreeMarkerTemplateUtils.processTemplateIntoString(freemarker.getTemplate(email.type().template()), model);

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
				StandardCharsets.UTF_8.name());
		helper.setTo(email.to());
		helper.setFrom(mailFrom);
		helper.setSubject(email.type().subject(email.data()));
		helper.setText(html, true);
		helper.addInline("logo.png", new ClassPathResource("logo.png"));

		mailSender.send(message);
		log.info("Sent {} email to {}", email.type(), email.to());
	}
}
