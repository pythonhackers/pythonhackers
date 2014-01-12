from pyhackers.idgen import idgen_client
from pyhackers.model.cassandra.hierachy import Post, Discussion, DiscussionPost
from pyhackers.service.post import new_post


def new_discussion(title, text, current_user_id=None):
    disc_id = idgen_client.get()
    post_id = idgen_client.get()

    d = Discussion()
    d.id = disc_id
    d.post_id = post_id
    d.message_count = 1
    d.title = title
    d.user_count = 1
    d.users = {current_user_id}
    d.slug = title

    d.save()

    new_post(text, '', current_user_id)