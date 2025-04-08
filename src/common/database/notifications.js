import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getNotificationsByUserId(
  userId,
  isRead,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('is_read', isRead)
      .eq('receiver_user_id', userId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
  }
}

async function getNotificationsCountByUserId(profileId) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('id', { count: 'estimated', head: true })
      .eq('is_read', false)
      .eq('receiver_user_id', profileId);

    if (error) throw error;

    return {
      count,
    };
  } catch (error) {
    console.log(error);

    return {
      count: 0,
    };
  }
}

async function addNotification(payload) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert(payload)
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
    };
  }
}

async function updateNotificationById(id, payload) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update(payload)
      .eq('id', id)
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
    };
  }
}

export {
  getNotificationsByUserId,
  getNotificationsCountByUserId,
  addNotification,
  updateNotificationById,
};
