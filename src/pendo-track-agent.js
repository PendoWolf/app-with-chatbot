const AGENT_ID = "W-6O-VZBW3sw4724v3FlkS7hSIg";
const conversationId = crypto.randomUUID();

window.addEventListener("message", function (event) {
  if (!event.origin || event.origin.indexOf("chatbase.co") === -1) {
    return;
  }

  let data = event.data;
  if (!data) return;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return;
    }
  }
  if (typeof data !== "object") return;

  const type = data.type || "";

  if (type === "user_message") {
    pendo.trackAgent("prompt", {
      agentId: AGENT_ID,
      conversationId: conversationId,
      messageId: data.id || crypto.randomUUID(),
      content: data.message || data.content || "",
    });
  }

  if (type === "bot_message" || type === "bot_response") {
    pendo.trackAgent("agent_response", {
      agentId: AGENT_ID,
      conversationId: conversationId,
      messageId: data.id || crypto.randomUUID(),
      content: data.message || data.content || "",
    });
  }

  if (type === "feedback" || type === "reaction") {
    pendo.trackAgent("user_reaction", {
      agentId: AGENT_ID,
      conversationId: conversationId,
      messageId: data.messageId || data.id || crypto.randomUUID(),
      content: data.value || data.feedback || "",
    });
  }
});
