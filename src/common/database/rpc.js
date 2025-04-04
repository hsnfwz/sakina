import { supabase } from '../supabase';

async function increment(tableName, tableRowId, tableColumnName, amount) {
  try {
    const { data, error } = await supabase.rpc('increment', {
      table_name: tableName,
      row_id: tableRowId,
      row_column: tableColumnName,
      increment_amount: amount,
    });

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function decrement(tableName, tableRowId, tableColumnName, amount) {
  try {
    const { data, error } = await supabase.rpc('decrement', {
      table_name: tableName,
      row_id: tableRowId,
      row_column: tableColumnName,
      decrement_amount: amount,
    });
    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export { increment, decrement };
