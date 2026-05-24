Deno.serve((_req) => {
  return new Response(
    JSON.stringify({
      ok: true,
      service: "divbucket",
      timestamp: new Date().toISOString(),
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    },
  );
});
