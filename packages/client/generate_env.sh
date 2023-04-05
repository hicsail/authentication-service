#!/bin/bash

# Generate JSON file
echo "Generating env.json file"
cat > /usr/share/nginx/html/env.json <<EOF
{
EOF

# Loop through environment variables starting with VITE_
while IFS='=' read -r key value; do
  if [[ "$key" == VITE_* ]]; then
    name=$(echo "$key")
    echo "  \"$name\": \"$value\"," >> /usr/share/nginx/html/env.json
    echo "Adding $name to env.json"
  fi
done < <(env)

# Complete JSON file
echo "Adding timestamp to env.json"
cat >> /usr/share/nginx/html/env.json <<EOF
  "timestamp": $(date +%s)
}
EOF
echo "Done generating env.json file"
