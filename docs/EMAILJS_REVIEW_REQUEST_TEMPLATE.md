# EmailJS Template Setup - Review Request

This guide will help you create an EmailJS template for sending review requests to customers.

## Template ID
Create a new template in EmailJS dashboard with ID: **`template_review_request`**

## Template Variables
The following variables are sent from the code:
- `{{to_email}}` - Customer's email address
- `{{to_name}}` - Customer's name
- `{{company_name}}` - Name of the company requesting the review
- `{{review_link}}` - Link to the company's profile page where customer can leave a review

## Email Template (Romanian)

### Subject Line:
```
{{company_name}} - Ne-ar plăcea părerea ta despre serviciile noastre
```

### Email Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #fff;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .button {
      display: inline-block;
      background: #059669;
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background: #047857;
    }
    .footer {
      background: #f9fafb;
      padding: 20px;
      border-radius: 0 0 10px 10px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .stars {
      font-size: 30px;
      color: #fbbf24;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⭐ Ne-ar plăcea părerea ta!</h1>
  </div>
  
  <div class="content">
    <p>Bună {{to_name}},</p>
    
    <p>Echipa <strong>{{company_name}}</strong> te roagă să-ți iei câteva momente pentru a lăsa un review despre serviciile noastre de mutare.</p>
    
    <p>Feedback-ul tău este extrem de important pentru noi și ne ajută să îmbunătățim constant calitatea serviciilor oferite.</p>
    
    <div class="stars">⭐⭐⭐⭐⭐</div>
    
    <div style="text-align: center;">
      <a href="{{review_link}}" class="button">
        📝 Lasă un Review
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      Procesul durează doar câteva minute și ne ajută enorm să construim încrederea cu viitorii clienți.
    </p>
    
    <p style="margin-top: 20px;">
      Mulțumim pentru timpul acordat!<br>
      <strong>Echipa {{company_name}}</strong>
    </p>
  </div>
  
  <div class="footer">
    <p>
      Acest email a fost trimis automat de pe platforma OferteMutare.ro<br>
      Dacă nu ai colaborat recent cu {{company_name}}, te rugăm să ignori acest mesaj.
    </p>
  </div>
</body>
</html>
```

## Setup Instructions

### Step 1: Create Template in EmailJS
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. Set Template ID to: `template_review_request`
5. Set Template Name to: "Review Request - Romanian"

### Step 2: Configure Template Content
1. **Subject**: Copy the subject line from above
2. **Content**: Switch to HTML mode and paste the HTML template
3. Make sure all variables are properly inserted: `{{to_email}}`, `{{to_name}}`, `{{company_name}}`, `{{review_link}}`

### Step 3: Test the Template
1. In the template editor, click **Test It**
2. Fill in test values:
   - `to_email`: your-test-email@example.com
   - `to_name`: Test User
   - `company_name`: Test Company SRL
   - `review_link`: https://ofertemutare.ro/company/profile?id=test123
3. Send test email and verify formatting

### Step 4: Verify Integration
1. Make sure your `.env` file has the correct EmailJS credentials:
   ```env
   NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_258bq8e
   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=Z5wQV4TL68ltUqmyQ
   ```
2. The template ID `template_review_request` is hardcoded in the profile page

### Step 5: Test in Application
1. Go to your company profile page: http://localhost:3001/company/profile
2. Click "Cere Review" button
3. Fill in a test customer name and your email
4. Click "Trimite Cerere"
5. Check your inbox for the review request email

## Troubleshooting

### Email not received?
1. **Check spam folder** - EmailJS emails sometimes go to spam
2. **Verify EmailJS dashboard** - Check the "History" tab to see if email was sent
3. **Check template ID** - Must be exactly `template_review_request`
4. **Verify service ID** - Must match your EmailJS service
5. **Check browser console** - Look for any error messages

### Template variables not working?
1. Make sure variable names match exactly: `{{to_email}}`, `{{to_name}}`, etc.
2. Double-check spelling and capitalization
3. Variables must be wrapped in double curly braces

### Email looks broken?
1. Make sure you're in **HTML mode** when pasting the template
2. Check that all HTML tags are properly closed
3. Test on different email clients (Gmail, Outlook, etc.)

## Production Deployment

When deploying to Vercel, make sure:
1. All `NEXT_PUBLIC_EMAILJS_*` environment variables are set in Vercel dashboard
2. Template ID `template_review_request` exists in your EmailJS account
3. EmailJS service is active and has sufficient quota

## Future Enhancements

Consider adding:
- **Review tracking** - Save which customers received review requests in Firestore
- **Cooldown period** - Prevent sending multiple requests to same customer within X days
- **Automated triggers** - Send review request automatically N days after move completion
- **Review form** - Create a dedicated page for customers to submit reviews
- **Rating storage** - Save customer reviews in Firestore under `companies/{id}/reviews` collection
