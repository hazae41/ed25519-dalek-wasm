extern crate alloc;

use alloc::{boxed::Box, vec::Vec};

use wasm_bindgen::prelude::*;

use rand::rngs::OsRng;

use crate::x25519::public_key::X25519PublicKey;
use crate::x25519::shared_secret::X25519SharedSecret;

#[wasm_bindgen]
pub struct X25519StaticSecret {
    pub(crate) inner: Box<x25519_dalek::StaticSecret>,
}

#[wasm_bindgen]
impl X25519StaticSecret {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let secret = x25519_dalek::StaticSecret::new(&mut OsRng {});
        let inner = Box::new(secret);

        Self { inner }
    }

    #[wasm_bindgen]
    pub fn from_bytes(input: &[u8]) -> Result<X25519StaticSecret, JsError> {
        let bytes: [u8; 32] = input.try_into().map_err(JsError::from)?;
        let secret = x25519_dalek::StaticSecret::from(bytes);
        let inner = Box::new(secret);

        Ok(Self { inner })
    }

    #[wasm_bindgen]
    pub fn to_bytes(&self) -> Vec<u8> {
        self.inner.to_bytes().to_vec()
    }

    #[wasm_bindgen]
    pub fn diffie_hellman(&self, other: &X25519PublicKey) -> X25519SharedSecret {
        let shared = self.inner.diffie_hellman(&other.inner);
        let inner = Box::new(shared);

        X25519SharedSecret { inner }
    }

    #[wasm_bindgen]
    pub fn to_public(&self) -> X25519PublicKey {
        let public = x25519_dalek::PublicKey::from(self.inner.as_ref());
        let inner = Box::new(public);

        X25519PublicKey { inner }
    }
}
