import { serve } from "https://deno.land/std@0.141.0/http/server.ts";

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
  <title>Form App</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background-color: #323233;
    }
    form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 25px;
  border: 2px, solid, #4CAF50;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

input {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
  </style>
</head>
<body>
  <form action="/generate" method="POST">
    <input type="text" name="user_input" placeholder="Type text" />
    <button type="submit">Submit</button>
  </form>
</body> 
</html>
`;

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  if (req.method === "POST" && url.pathname === "/generate") {
    const formData = await req.formData();
    const userInput = formData.get("user_input");
    const newUrl = new URL(req.url);
    newUrl.pathname = `/display/${encodeURIComponent(userInput as string)}`;
    return new Response(`<a href="${newUrl}">${newUrl}</a>`, { headers: { "Content-Type": "text/html" } });
  }

  else if (req.method === "GET" && url.pathname.startsWith("/display/")) {
    const text = decodeURIComponent(url.pathname.split("/").pop() || "");
    return new Response(text, { status: 200 });
  }
  return new Response(html, { headers: { "Content-Type": "text/html" } });
}

await serve(handler);
