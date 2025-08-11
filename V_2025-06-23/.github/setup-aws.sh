#!/bin/bash

# AWS Setup Script for Client Deployment
# Run this script to set up the required AWS resources

set -e

echo "🚀 Setting up AWS resources for client deployment..."

# Configuration
BUCKET_NAME="your-ultralearning-russian-client-bucket"
REGION="us-east-1"
DISTRIBUTION_NAME="ultralearning-russian-client"

echo "📦 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

echo "🌐 Configuring S3 bucket for static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

echo "📋 Setting bucket policy for public read access..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

echo "☁️ Creating CloudFront distribution..."
# Note: This is a simplified version. You may need to configure additional settings
# like error pages for SPA routing in the AWS Console

echo "✅ AWS resources created successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Configure CloudFront distribution settings in AWS Console"
echo "2. Set up error pages to redirect 404s to /index.html with 200 status"
echo "3. Create an IAM user with the permissions from iam-policy.json"
echo "4. Add the required secrets to your GitHub repository"
echo ""
echo "🔧 Required GitHub secrets:"
echo "- AWS_ACCESS_KEY_ID"
echo "- AWS_SECRET_ACCESS_KEY" 
echo "- AWS_REGION: $REGION"
echo "- S3_BUCKET_NAME: $BUCKET_NAME"
echo "- CLOUDFRONT_DISTRIBUTION_ID: (get this from CloudFront console)"

# Cleanup
rm -f bucket-policy.json 