// supabase/functions/checkAdminPassword/index.ts

Deno.serve(async (req) => {
  try {
    const { adminPasswordInput } = await req.json();

    const isValid = Deno.env.get("ACCOUNT_CREATION_PASSWORD") === adminPasswordInput;

    if (isValid) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid admin password" }),
        { status: 403 }
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
});
