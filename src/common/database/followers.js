import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getFollowersBySenderUserId(
  senderUserId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('sender_user_id', senderUserId)
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
      data: null,
      hasMore: false,
    };
  }
}

async function getFollowersByReceiverUserId(
  receiverUserId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('receiver_user_id', receiverUserId)
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
      data: null,
      hasMore: false,
    };
  }
}

async function addFollower(senderProfileId, receiverProfileId) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .insert({
        sender_user_id: senderProfileId,
        receiver_user_id: receiverProfileId,
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

async function removeFollower(id) {
  try {
    const { error } = await supabase.from('followers').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function getFollowerBySenderUserIdAndReceiverUserId(
  senderUserId,
  receiverUserId
) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('sender_user_id', senderUserId)
      .eq('receiver_user_id', receiverUserId);

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
  getFollowersBySenderUserId,
  getFollowersByReceiverUserId,
  addFollower,
  getFollowerBySenderUserIdAndReceiverUserId,
  removeFollower,
};
