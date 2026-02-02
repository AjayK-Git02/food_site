'use client';

import { createClient } from '@supabase/supabase-js';

// Function to get valid config or fallback to demo
const getValidSupabaseConfig = () => {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If URL is missing, is a placeholder, or invalid, use demo URL
  if (!url || url.includes('your_project') || !url.startsWith('http')) {
    console.warn('Using Demo Supabase URL - Environment variables missing or invalid');
    url = 'https://demo.supabase.co';
  }

  // If Key is missing or is a placeholder, use demo key
  if (!key || key.includes('your_anon_key')) {
    console.warn('Using Demo Supabase Key');
    key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTEwMDAwMCwiZXhwIjoxOTYwNjc2MDAwfQ.demo';
  }

  return { url, key };
};

const { url: supabaseUrl, key: supabaseKey } = getValidSupabaseConfig();

let supabase;

if (process.env.NODE_ENV === 'production') {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  if (!global.supabase) {
    global.supabase = createClient(supabaseUrl, supabaseKey);
  }
  supabase = global.supabase;
}

export { supabase };

// Helper functions for database operations

// Fetch all days
export async function getDays() {
  const { data, error } = await supabase
    .from('days')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return data;
}

// Fetch single day
export async function getDay(dayId) {
  const { data, error } = await supabase
    .from('days')
    .select('*')
    .eq('id', dayId)
    .single();

  if (error) throw error;
  return data;
}

// Fetch foods by day
export async function getFoodsByDay(dayId, timeSlot = null) {
  let query = supabase
    .from('foods')
    .select('*')
    .eq('day_id', dayId);

  if (timeSlot) {
    query = query.eq('time_slot', timeSlot);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Fetch all foods with day name (Admin)
export async function getAllFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*, days(name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(food => ({
    ...food,
    day: food.days?.name
  }));
}

// Fetch special foods (Home Page)
export async function getSpecialFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('is_special', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// Fetch single food
export async function getFood(foodId) {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .eq('id', foodId)
    .single();

  if (error) throw error;
  return data;
}

// Add new food (Admin)
export async function addFood(foodData) {
  const { data, error } = await supabase
    .from('foods')
    .insert([foodData])
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Insert failed: No data returned. Check your permissions.');
  return data[0];
}

// Update food (Admin)
export async function updateFood(foodId, foodData) {
  const { id, created_at, ...updates } = foodData;
  const { data, error } = await supabase
    .from('foods')
    .update(updates)
    .eq('id', foodId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Update failed: No data returned. Check your permissions.');
  return data[0];
}

// Delete food (Admin)
export async function deleteFood(foodId) {
  const { error } = await supabase
    .from('foods')
    .delete()
    .eq('id', foodId);

  if (error) throw error;
}

// Upload image to Supabase Storage
export async function uploadFoodImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `food-images/${fileName}`;

  const { data, error } = await supabase.storage
    .from('food-images')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('food-images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Get site settings
export async function getSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

// Update site settings (Admin)
export async function updateSettings(settingsData) {
  const { id, created_at, updated_at, ...updates } = settingsData;

  // 1. Try to get existing ID if we don't have one
  let targetId = id;
  if (!targetId) {
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single();
    if (existing) {
      targetId = existing.id;
    }
  }

  // 2. Perform Update or Insert
  let result;

  if (targetId) {
    // Update existing
    result = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', targetId)
      .select();
  } else {
    // Insert new (Upsert)
    result = await supabase
      .from('site_settings')
      .insert([updates])
      .select();
  }

  const { data, error } = result;

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Update failed: No data returned. You are likely not logged in or lack permissions.');
  return data[0];
}

// Auth functions
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}
