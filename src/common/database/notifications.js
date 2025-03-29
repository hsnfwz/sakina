import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getNotificationsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
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

async function getNotificationsCountByProfileId(profileId) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'estimated', head: true })
      .eq('is_read', false)
      .eq('receiver_user_id', profileId);

    if (error) throw error;

    return {
      count,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedPostsNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('type', 'ACCEPTED')
      .eq('receiver_user_id', profileId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getPendingPostsNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('type', 'PENDING')
      .eq('receiver_user_id', profileId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getRejectedPostsNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('type', 'REJECTED')
      .eq('receiver_user_id', profileId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getFollowerNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('type', 'FOLLOW')
      .eq('receiver_user_id', profileId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function addNotification(senderProfileId, receiverProfileId, type) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        sender_user_id: senderProfileId,
        receiver_user_id: receiverProfileId,
        type,
      })
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

export {
  getNotificationsByUserId,
  getNotificationsCountByProfileId,
  addNotification,
};
