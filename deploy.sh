JEKYLL_ENV="production" bundle exec jekyll build
aws --profile trajectory s3 cp _site/ s3://sambleckley.com/ --recursive --exclude "Untitled.sketch" --region us-east-2 --cache-control max-age=120 --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
