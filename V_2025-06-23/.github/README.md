# Client Deployment Setup

This workflow automatically deploys the client to S3/CloudFront when pushing to the main branch.

## Prerequisites

### 1. AWS Resources Setup

You need to create the following AWS resources:

#### S3 Bucket
1. Create an S3 bucket for hosting your static files
2. Configure the bucket for static website hosting
3. Set up bucket policy to allow public read access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

#### CloudFront Distribution
1. Create a CloudFront distribution
2. Set the S3 bucket as the origin
3. Configure the distribution for SPA routing (if needed):
   - Set error pages to redirect 404s to `/index.html` with 200 status

#### IAM User
1. Create an IAM user with the following permissions:
   - `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` for your S3 bucket
   - `cloudfront:CreateInvalidation` for your CloudFront distribution

### 2. GitHub Secrets

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `AWS_ACCESS_KEY_ID`: Your IAM user's access key
- `AWS_SECRET_ACCESS_KEY`: Your IAM user's secret key
- `AWS_REGION`: Your AWS region (e.g., `us-east-1`)
- `S3_BUCKET_NAME`: Your S3 bucket name
- `CLOUDFRONT_DISTRIBUTION_ID`: Your CloudFront distribution ID

## How it works

1. When you push to the `main` branch and the changes include files in `V_2025-06-23/client/`, the workflow triggers
2. The workflow:
   - Sets up Node.js 18
   - Installs dependencies
   - Builds the client using `npm run build`
   - Syncs the built files to S3
   - Invalidates the CloudFront cache to ensure users get the latest version

## Troubleshooting

- Make sure your S3 bucket is configured for static website hosting
- Ensure your CloudFront distribution is properly configured with the S3 bucket as origin
- Verify that your IAM user has the necessary permissions
- Check that all GitHub secrets are correctly set 