import { supabase } from '../supabase';

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

async function getFollowersBySenderProfileId(senderProfileId) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('sender_user_id', senderProfileId);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getFollowerBySenderProfileIdAndReceiverProfileId(
  senderProfileId,
  receiverProfileId
) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, sender:sender_user_id(*), receiver:receiver_user_id(*)')
      .eq('sender_user_id', senderProfileId)
      .eq('receiver_user_id', receiverProfileId);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

export {
  getFollowersBySenderProfileId,
  addFollower,
  getFollowerBySenderProfileIdAndReceiverProfileId,
  removeFollower,
};
