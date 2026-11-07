package com.tool.ProjectTool.messaging;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import freemarker.template.Configuration;
import jakarta.mail.Multipart;
import jakarta.mail.Part;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

class EmailListenerTest {

	private JavaMailSender mailSender;
	private EmailListener listener;

	@BeforeEach
	void setUp() {
		mailSender = mock(JavaMailSender.class);
		when(mailSender.createMimeMessage()).thenAnswer(inv -> new MimeMessage((Session) null));

		Configuration freemarker = new Configuration(Configuration.VERSION_2_3_34);
		freemarker.setClassForTemplateLoading(getClass(), "/templates");
		listener = new EmailListener(mailSender, freemarker, "probucket@info.co.in", "http://app.test");
	}

	@Test
	void teamInviteNamesTheInviterAndProjectAndLinksToVerify() throws Exception {
		listener.send(new EmailMessage(EmailType.TEAM_INVITE, "new@member.test",
				Map.of("token", "tok123", "inviterName", "Asha", "projectName", "Apollo")));

		MimeMessage sent = sentMessage();
		assertThat(sent.getSubject()).isEqualTo("You've been added to Apollo on ProBucket");
		assertThat(((InternetAddress) sent.getAllRecipients()[0]).getAddress()).isEqualTo("new@member.test");
		String html = html(sent);
		assertThat(html).contains("Asha added you to <strong>Apollo</strong>")
				.contains("http://app.test/verify?token=tok123")
				.doesNotContainIgnoringCase("password reset");
	}

	@Test
	void teamInviteEscapesNamesTypedByUsers() throws Exception {
		listener.send(new EmailMessage(EmailType.TEAM_INVITE, "new@member.test",
				Map.of("token", "t", "inviterName", "<b>Eve</b>", "projectName", "A & B")));

		String html = html(sentMessage());
		assertThat(html).contains("&lt;b&gt;Eve&lt;/b&gt;").contains("A &amp; B").doesNotContain("<b>Eve</b>");
	}

	@Test
	void verifyAndResetEmailsKeepTheirSubjectsAndLinks() throws Exception {
		listener.send(new EmailMessage(EmailType.VERIFY_ACCOUNT, "a@b.test", Map.of("token", "v1")));
		listener.send(new EmailMessage(EmailType.PASSWORD_RESET, "a@b.test", Map.of("token", "r1")));

		ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
		verify(mailSender, org.mockito.Mockito.times(2)).send(captor.capture());
		MimeMessage verifyMail = captor.getAllValues().get(0);
		MimeMessage resetMail = captor.getAllValues().get(1);
		assertThat(verifyMail.getSubject()).isEqualTo("Verify email request");
		assertThat(html(verifyMail)).contains("http://app.test/verify?token=v1");
		assertThat(resetMail.getSubject()).isEqualTo("Complete your password reset request");
		assertThat(html(resetMail)).contains("http://app.test/reset-passwords?token=r1");
	}

	// Throwing is what makes RabbitMQ retry it and then park it in the dead-letter queue
	@Test
	void aMailServerFailureIsThrownSoTheMessageIsRetried() {
		doThrow(new MailSendException("smtp down")).when(mailSender).send(any(MimeMessage.class));

		assertThatThrownBy(() -> listener.send(new EmailMessage(EmailType.VERIFY_ACCOUNT, "a@b.test", Map.of("token", "x"))))
				.isInstanceOf(MailSendException.class);
	}

	private MimeMessage sentMessage() {
		ArgumentCaptor<MimeMessage> captor = ArgumentCaptor.forClass(MimeMessage.class);
		verify(mailSender).send(captor.capture());
		return captor.getValue();
	}

	// The HTML body, read back from the message as it would go over the wire
	private static String html(MimeMessage message) throws Exception {
		java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
		message.writeTo(out);
		return findHtml(new MimeMessage((Session) null, new java.io.ByteArrayInputStream(out.toByteArray())));
	}

	private static String findHtml(Part part) throws Exception {
		if (part.isMimeType("text/html")) {
			return (String) part.getContent();
		}
		if (part.getContent() instanceof Multipart multipart) {
			for (int i = 0; i < multipart.getCount(); i++) {
				String found = findHtml(multipart.getBodyPart(i));
				if (found != null) {
					return found;
				}
			}
		}
		return null;
	}
}
