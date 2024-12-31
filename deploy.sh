JEKYLL_ENV="production" bundle exec jekyll build
aws --profile trajectory s3 cp _site/ s3://sambleckley.com/ --recursive --exclude "assets/images/art/*" --region us-east-2 --cache-control max-age=120 --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;
aws --profile trajectory s3 cp _site/feed/writing.xml s3://sambleckley.com/feed.xml  --region us-east-2 --cache-control max-age=120 --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers;

