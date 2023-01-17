export * from "../../../wasm/pkg/berith.js";

import { init, InitOutput, initSync } from "../../../wasm/pkg/berith.js";
import { wasm } from "../../../wasm/pkg/berith.wasm.js";

let output: InitOutput | undefined = undefined

export function initSyncBundledOnce() {
  return output ??= initSync(Buffer.from(wasm, "base64"))
}

export async function initBundledOnce() {
  return output ??= await init(Buffer.from(wasm, "base64"))
}