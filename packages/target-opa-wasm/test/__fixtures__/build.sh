#/bin/sh

set -e

# Validate OPA is installed
if ! opa version >> /dev/null 2>&1; then
	echo "OPA is not installed. Please install OPA and try again."
	exit 1
fi

# For all OPA files in the policies directory, build them into a single WASM file.
for policy in $(find . -name '*.rego' ! -name '*_test.rego'); do
	TEMP_DIR=$(mktemp -d)

	echo "Building $policy (using '$TEMP_DIR')"
	opa build -t wasm -e main -o $TEMP_DIR/bundle.tar.gz $policy

	# Extract the policy.wasm from the tarball
	tar -xzf $TEMP_DIR/bundle.tar.gz -C $TEMP_DIR /policy.wasm
	mv $TEMP_DIR/policy.wasm $(pwd)/$(basename $policy .rego).wasm
	rm -rf $TEMP_DIR

	echo "Built $(basename $policy .rego).wasm"
done
