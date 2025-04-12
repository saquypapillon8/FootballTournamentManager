const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  '[https://fwagotasonvgpdqmedqk.supabase.co](https://fwagotasonvgpdqmedqk.supabase.co)',
  process.env.SUPABASE_KEY
);

module.exports = {
  register: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role: 'player' } } // Ajoutez le rôle par défaut
    });
    return { data, error };
  },
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  }
};