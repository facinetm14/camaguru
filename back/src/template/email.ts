export const confirmationTemplate = (verifyLink: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm Your Email</title>
        </head>
        <body>
            <div class="container m-auto">
                <div class="content">
                  <p>Thank you for signing up! Please confirm your email address by clicking the link below:</p>
                  <a href="${verifyLink}" class="btn btn-primary">Verify Email</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 CamagruApp. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
       
    `;
};

export const resetPasswordLinkTemplate = (verifyLink: string) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
        </head>
        <body>
            <div class="container m-auto">
                <div class="content">
                  <p>We receive a reset password request from your account, click the link below to create a new password:</p>
                  <a href="${verifyLink}" class="btn btn-primary">Verify Email</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 CamagruApp. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
       
    `;
};

export const CommentNotificationTemplate = (
  authorName: string,
  comment: {
    authorName: string;
    content: string;
  },
  imageName: string
) => {
  return `
     <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Someone Commented Your image</title>
        </head>
        <body>
            <div class="container m-auto">
                <div class="content">
                  <p>Hello ${authorName}, ${comment.authorName} commented your image ${imageName} with the message below:</p>
                  <p>${comment.content}</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 CamagruApp. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
  `;
};
