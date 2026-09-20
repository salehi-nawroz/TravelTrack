import supabase from "./supabaseClient";

export async function getProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User is not authenticated.");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateProfile({ full_name, avatar_path }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User is not authenticated.");

  const { data, error } = await supabase
    .from("profiles")
    .update({ full_name, avatar_path })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}
