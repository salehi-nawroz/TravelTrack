import supabase from "./supabaseClient";

export async function deleteAccount() {
  const { error } = await supabase.rpc("delete_own_account");
  if (error) throw new Error(error.message);
}
