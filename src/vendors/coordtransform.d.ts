declare module '@/vendors/coordtransform' {
  /**
   * Convert WGS84 coordinates to Mars coordinates (GCJ02)
   * @param lng - longitude
   * @param lat - latitude
   * @returns Mars coordinates (GCJ02) as [lng: number, lat: number]
   */
  export function wgs84togcj02(lng: number, lat: number): [number, number]

  /**
   * Convert Mars coordinates (GCJ02) to WGS84 coordinates
   * @param lng - longitude
   * @param lat - latitude
   * @returns WGS84 coordinates as [lng: number, lat: number]
   */
  export function gcj02towgs84(lng: number, lat: number): [number, number]
}
