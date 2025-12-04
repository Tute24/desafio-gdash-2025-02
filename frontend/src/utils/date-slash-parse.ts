export function dateSlashParse(string: string | null | undefined) {
  if (string) return string.replaceAll('-', '/')
}
