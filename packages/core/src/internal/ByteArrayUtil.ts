export namespace ByteArrayUtil {
  export function toUtf8(byteArray: Uint8Array): string {
    return new TextDecoder().decode(byteArray);
  }
}
