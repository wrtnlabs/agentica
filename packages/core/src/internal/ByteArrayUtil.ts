export namespace ByteArrayUtil {
  export const toUtf8 = (byteArray: Uint8Array): string => {
    return new TextDecoder().decode(byteArray);
  };
}
