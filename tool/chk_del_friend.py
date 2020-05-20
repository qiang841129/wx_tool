import itchat

def chk_del_friend():
    chartroomUserName = itchat.get_friends()[0]['UserName']
    for friend in itchat.get_friends()[1:]:
        r = itchat.add_member_into_chatroom(chartroomUserName, [friend])
        if r['BaseResponse']['ErrMsg'] == '':
            itchat.delete_member_from_chatroom(chartroomUserName, [friend])
            print(r['MemberCount'])
            if r['MemberCount'] == 0:
                continue
            status = r['MemberList'][0]['MemberStatus']
            if status == 3:
                print(friend, '该好友已经将你加入黑名单。')
            elif status == 4:
                print(friend, '该好友已经将你删除。')


itchat.auto_login(True)
chk_del_friend()

