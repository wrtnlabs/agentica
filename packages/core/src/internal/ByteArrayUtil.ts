export namespace ByteArrayUtil {
  export const toUtf8 = (byteArray: Uint8Array): string => {
    return Buffer.from(byteArray).toString("utf-8");
  };
}
