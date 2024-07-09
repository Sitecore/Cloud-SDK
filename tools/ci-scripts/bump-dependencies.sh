set -e
readarray -t affected_packages < <(npx nx show projects --affected --base="$1" --exclude="apps/*,@sitecore-cloudsdk")
cd packages
for affected in "${affected_packages[@]}"; do
    new_version="^$(cd $affected && npm pkg get version | jq -r '.[]' && cd ..)"
    echo "Running checks for $affected package with new version:$new_version"
    for package in "${affected_packages[@]}"; do
        if [ "$affected" = "$package" ]; then
            continue
        fi
        cd $package
        prop="dependencies.@sitecore-cloudsdk/$affected"
        if [ $(npm pkg get $prop | jq -r '.[]') != "{}" ]; then
            npm pkg set $prop=$new_version >/dev/null
            echo "Updated @sitecore-cloudsdk/$affected in @sitecore-cloudsdk/$package to $new_version version."
        fi
        cd ..
    done
done
