// Pendo Agent Analytics for the Chatbase widget embedded in index.html.
// Uses the Chatbase embed event listeners ("user-message",
// "assistant-message", "tool-call") so each event is tracked exactly once.
const AGENT_ID = "lxeWFyrjLBeWbiZDi-M989iXVQ8";
const conversationId = crypto.randomUUID();

let pendingTools = [];

function trackAgent(eventType, metadata) {
  if (
    typeof window.pendo === "undefined" ||
    typeof window.pendo.trackAgent !== "function"
  ) {
    return;
  }
  window.pendo.trackAgent(eventType, {
    agentId: AGENT_ID,
    conversationId,
    ...metadata,
  });
}

function getContent(event) {
  const content = event?.data?.content;
  return typeof content === "string" ? content : "";
}

if (window.chatbase) {
  window.chatbase.addEventListener("user-message", (event) => {
    pendingTools = [];
    trackAgent("prompt", {
      messageId: crypto.randomUUID(),
      content: getContent(event),
      suggestedPrompt: false,
    });
  });

  window.chatbase.addEventListener("tool-call", (event) => {
    const name = event?.data?.name;
    if (name && !pendingTools.includes(name)) {
      pendingTools.push(name);
    }
  });

  window.chatbase.addEventListener("assistant-message", (event) => {
    trackAgent("agent_response", {
      messageId: crypto.randomUUID(),
      content: getContent(event),
      toolsUsed: pendingTools,
    });
    pendingTools = [];
  });
}
