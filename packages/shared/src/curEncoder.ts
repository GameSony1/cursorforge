import toIco from 'to-ico';

export interface CurSourceImage {
  size: number;
  png: Buffer;
  hotspot: { x: number; y: number };
}

/**
 * Builds a Windows .cur file from a set of square PNGs.
 * `to-ico` already produces a spec-correct ICO (BMP/PNG frames + AND mask);
 * a .cur is byte-identical except idType=2 and the per-entry planes/bitCount
 * fields are repurposed as the hotspot x/y, so we patch those in place.
 */
export async function encodeCur(images: CurSourceImage[]): Promise<Buffer> {
  if (images.length === 0) {
    throw new Error('encodeCur requires at least one image');
  }

  const icoBuffer = await toIco(images.map((img) => img.png));
  const buf = Buffer.from(icoBuffer);

  buf.writeUInt16LE(2, 2); // ICONDIR.idType: 1 = icon, 2 = cursor

  const count = buf.readUInt16LE(4);
  for (let i = 0; i < count; i++) {
    const entryOffset = 6 + i * 16;
    const rawWidth = buf.readUInt8(entryOffset);
    const width = rawWidth === 0 ? 256 : rawWidth;
    const match = images.find((img) => img.size === width) ?? images[i];
    buf.writeUInt16LE(match.hotspot.x, entryOffset + 4);
    buf.writeUInt16LE(match.hotspot.y, entryOffset + 6);
  }

  return buf;
}
