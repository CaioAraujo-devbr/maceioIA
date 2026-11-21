export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_MESSAGES = 40;
export const MAX_REQUEST_BYTES = 64 * 1024;

export const MAX_REPLY_LENGTH = 12_000;
export function limitReply(content: string): string {
  if (content.length <= MAX_REPLY_LENGTH) return content;
  const note = "\n\nResposta resumida. Peça mais detalhes sobre uma parte do roteiro.";
  return content.slice(0, MAX_REPLY_LENGTH - note.length).replace(/[\uD800-\uDBFF]$/, "") + note;
}
