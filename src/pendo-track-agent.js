var AGENT_ID = "lcAcwRX_kDrCOjlhDC8iTeK7xwc";
var conversationId = crypto.randomUUID();

window.addEventListener("message", function (event) {
  if (!event.origin || event.origin.indexOf("chatbase.co") === -1) {
    return;
  }

  var data = event.data;
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch {
      return;
    }
  }
  if (!data || typeof data !== "object") return;
  if (
    typeof window.pendo === "undefined" ||
    typeof window.pendo.trackAgent !== "function"
  ) {
    return;
  }

  var type = (data.type || "").toLowerCase();

  if (type.indexOf("user") !== -1 || type.indexOf("sent") !== -1) {
    window.pendo.trackAgent("prompt", {
      agentId: AGENT_ID,
      conversationId: conversationId,
      messageId: data.messageId || crypto.randomUUID(),
      content: data.message || data.text || data.content || "",
    });
  }

  if (
    type.indexOf("bot") !== -1 ||
    type.indexOf("received") !== -1 ||
    type.indexOf("response") !== -1 ||
    type.indexOf("answer") !== -1
  ) {
    window.pendo.trackAgent("agent_response", {
      agentId: AGENT_ID,
      conversationId: conversationId,
      messageId: data.messageId || crypto.randomUUID(),
      content: data.message || data.text || data.content || "",
    });
  }
});
