aws --profile trajectory s3 cp _site/ s3://sambleckley.com/ --recursive --exclude "assets/images/art/*" --exclude "Untitled.sketch" --region us-east-2 --cache-control max-age=120;
for key in $( find ./_site -type f | sed "s|^\./_site/||" ); do
  aws --profile trajectory s3api put-object-acl --bucket sambleckley.com --region us-east-2 --key $key --grant-read uri=http://acs.amazonaws.com/groups/global/AllUsers;
done
