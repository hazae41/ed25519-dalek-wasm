import { Buffer } from "https://deno.land/std@0.170.0/node/buffer.ts";
import { assert, test } from "npm:@hazae41/phobos";
import { Ed25519Signature, Ed25519SigningKey, Ed25519VerifyingKey, Memory, X25519PublicKey, X25519StaticSecret, initBundledOnce } from "./mod.ts";

function equals(a: Uint8Array, b: Uint8Array) {
  const ba = Buffer.from(a.buffer)
  const bb = Buffer.from(b.buffer)

  return ba.equals(bb)
}

function assertEd25519SigningKey(keypair: Ed25519SigningKey) {
  const bytes = keypair.to_bytes()
  const bytes2 = Ed25519SigningKey.from_bytes(bytes).to_bytes()

  assert(equals(bytes.bytes, bytes2.bytes), `keypair.to_bytes serialization`)
}

function assertEd25519VerifyingKey(identity: Ed25519VerifyingKey) {
  const bytes = identity.to_bytes()
  const bytes2 = Ed25519VerifyingKey.from_bytes(bytes).to_bytes()

  assert(equals(bytes.bytes, bytes2.bytes), `identity.to_bytes serialization`)
}

function assertEd25519Signature(signature: Ed25519Signature) {
  const bytes = signature.to_bytes()
  const bytes2 = Ed25519Signature.from_bytes(bytes).to_bytes()

  assert(equals(bytes.bytes, bytes2.bytes), `signature.to_bytes serialization`)
}

test("Ed25519", async () => {
  await initBundledOnce()

  const hello = new TextEncoder().encode("hello world")
  const mhello = new Memory(hello)

  const keypair = new Ed25519SigningKey()
  const identity = keypair.public()

  assertEd25519SigningKey(keypair)
  assertEd25519VerifyingKey(identity)

  const signature = keypair.sign(mhello)

  assertEd25519Signature(signature)

  assert(identity.verify(mhello, signature), `signature should be verified`)
})

function assertX25519StaticSecret(secret: X25519StaticSecret) {
  const bytes = secret.to_bytes()
  const bytes2 = X25519StaticSecret.from_bytes(bytes).to_bytes()

  assert(equals(bytes.bytes, bytes2.bytes), `secret.to_bytes serialization`)
}

function assertX25519PublicKey(publick: X25519PublicKey) {
  const bytes = publick.to_bytes()
  const bytes2 = X25519PublicKey.from_bytes(bytes).to_bytes()

  assert(equals(bytes.bytes, bytes2.bytes), `publick.to_bytes serialization`)
}

test("X25519", async () => {
  await initBundledOnce()

  const secretx = new X25519StaticSecret()
  const secrety = new X25519StaticSecret()

  assertX25519StaticSecret(secretx)
  assertX25519StaticSecret(secrety)

  const publicx = secretx.to_public()
  const publicy = secrety.to_public()

  assertX25519PublicKey(publicx)
  assertX25519PublicKey(publicy)

  const sharedx = secretx.diffie_hellman(publicy)
  const sharedy = secrety.diffie_hellman(publicx)

  assert(equals(sharedx.to_bytes().copyAndDispose(), sharedy.to_bytes().copyAndDispose()), `secrets should be equal`)
})