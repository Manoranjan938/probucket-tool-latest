<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" />
    <title>Document</title>
    <style>
        body{
            font-family: Arial, Helvetica, sans-serif;
            background: #c4bebe;
        }
        .template_container{
            background-color: #fff;
            width: 650px;
            margin: 6% auto;
            border-radius: 5px;
        }
        .logo{
           display: flex;
           gap: 10px;
           align-items: center!important;
        }

        .logo > img{
            width: 100px;
            height: 100px;
            margin-left: 40px;
        }
        .logo > span{
            font-size: 36px;
            font-weight: 600;
            font-family: Arial, Helvetica, sans-serif;
            color: #827ED8;
            display: flex;
            align-items: center!important;
        }

        .icon{
            width: 100%;
            height: 100px;
            background: #827ED8;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
        .contents{
            margin: 40px;
            width: auto;
            height: auto;
            padding: 0 5rem;
            font-family: Arial, Helvetica, sans-serif;
        }
        .contents > h1{
            font-size: 34px;
            text-align: center;
            color: #555555;
        }
        .contents > p{
            font-size: 16px;
            color: #555555;
        }
        .contents > a{
          display: flex;
          justify-content: center;
          text-decoration: none;
        }
        .pwd_btn{
            padding: 10px 20px;
            border: none;
            background: #827ED8;
            color: #fff;
            font-weight: 600;
            font-size: 15px;
            border-radius: 5px;
            text-transform: uppercase;
            cursor: pointer;
        }
        .devider{
            margin: 20px 0;
            border-top: 1px solid #e5e5e5;
        }
        .footer{
            text-align: center;
            padding: 10px 0 ;
        }
        .footer > span{
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 15px;
        }
    </style>
</head>
<body>
    <div class="template_container">
        <div class="logo">
            <img src="cid:logo.png" alt="ProBucket Tool">
            <span>ProBucket</span>
        </div>
        <div class="icon">
            <h1>Password Reset Request</h1>
        </div>
        <div class="contents">
            <p>Dear ProBucket user,</p>
            <p>We have received your request to change your password. Please click the below button to complete the change</p>
            <a href="https://localhost:3002/reset-passwords?token=${token}">
              <button type="button" name="button" class="pwd_btn">Change my password</button>
            </a>
        </div>
        <div class="devider"></div>
        <div class="footer">
            <!-- <span style="font-size:12px;">Lorem ipsum</span><br> -->
            <span style="font-size:12px;">Copyright © ProBucket Tool Team</span>
        </div>
    </div>
</body>
</html>