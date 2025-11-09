pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template HashPreimage() {
    // Private input
    signal input secret;

    // Public output
    signal output publicHash;

    // Hash component
    component poseidon = Poseidon(1);

    // Connect secret to hash input
    poseidon.inputs[0] <== secret;

    // Connect hash output to public output
    publicHash <== poseidon.out;
}

component main = HashPreimage();