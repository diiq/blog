#!/bin/bash

for f in ../assets/images/art/*.*; do
  file=$(basename "$f")
  filename="${file%.*}"
  content="---
  layout: art
  title:  \"$filename\"
  images: [\"$file\"]
  date: 2011-08-25
  notes:
---
"
  echo "$content" > "$filename.markdown"
done


