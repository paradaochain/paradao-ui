export function IntlAddress(address: string, length = 30): string {
  return address.slice(0, 8).concat('...') + address.substring(63 - length);
}
