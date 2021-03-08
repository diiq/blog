---
layout: post
title: "Lateral Joins in&nbsp;Rails"
subtitle: "Making Activerecord do what it does not yet know it wants to do: Lateral Joins"
date: 2021-03-08
categories: code
notes:
---

Imagine you're making a Reddit clone in Rails. Your site has many `Posts`, and each post has thousands of `Comments`.

You want the front page to show a few hundred posts along with the top three comments on each post. You're planning on being very popular, so the front page will need to be very fast. How do you fetch that data efficiently from postgresql using Activerecord?

Making one `Comment` query per `Post` is too expensive; it's N+1 queries (one to fetch the posts, N to fetch the comments).

You could use includes to preload all the comments for all the posts, but that requires hydrating hundreds of thousands of records, even though you only need a few hundred for your front page.

What you want is some kind of `GROUP BY` with a `LIMIT` on each group --- but that doesn't exist, either in Activerecord nor even in postgres.

Postgres has a different solution for this problem: the `LATERAL JOIN`. ActiveRecord doesn't have built-in support for it, but here's what a lateral join looks like in SQL:

You could always select against this raw SQL directly, but then your query is not available for the chaining, adjusting, lazy-evaluating fun that ActiveRecord makes possible. Here's how to make that same query in conjunction with (or at least in spite of) ActiveRecord.

We're going to build the query from the inside out; concentrate on what each step _means_ and how we combine them, not what it will return if run in isolation. First, write a generic query you'd _like_ to run against each `Post`. We don't have a post to run against, so we're just describing a filter on `Comment`:

```ruby
filter = Comment.order(:rating).limit(3)
```

(Note this is NOT `post.comments.order...` we don't _know_ what post, yet. We want the final query to return comments, so our filter starts with `Comment`.)

Now constrain that query against a theoretical `Post` in our lateral join:

```ruby
filter = filter.where("comments.post_id = posts.id").select("comments.id")
```

Note that if you try to execute this line in the REPL, you'll get an error at this point; this query is now invalid outside the context of our lateral join because we haven't selected anything from the posts table yet. That's ok; we don't need our filter to run in isolation. Instead, we need it to convert to an sql string:

```ruby
comment_ids_query = Post.joins("JOIN LATERAL (#{filter.to_sql}) subquery ON true")
  .where("posts.id": front_page_posts)
  .select("subquery.id")
```

Now we have a functional lateral join, but the table is _ostensibly_ the posts table; and so the query can't be chained, ordered, limited, etc. Let's pack it inside a Comments query:

```ruby
Comment.where("comments.id IN (#{comment_ids_query.to_sql})")
```

All together, it looks like this:

```ruby
def top_comments(post_ids)
  filter = Comment.order(:rating).limit(3)
  filter = filter.where("comments.post_id = posts.id").select("comments.id")
  comment_ids_query = Post.joins("JOIN LATERAL (#{filter.to_sql}) subquery ON true")
    .where("posts.id": post_ids)
    .select("subquery.id")
  Comment.where("comments.id IN (#{comment_ids_query.to_sql})")
end
```

and does indeed return the first 3 Comments for all the post ids provided, in a single request.

Problems you'll encounter:

- Table aliases. As is often the case with complicated ActiveRecord chicanery, tables can alias in ways you don't expect, breaking your query. Luckily, the part of the query you're most likely to change is the initial filter -- and it is isolated inside its subquery, where the only potential conflict is with `posts` from the lateral join.
- Order and distinct: ordering the filter will behave correctly as far as limit is concerned, but the returned records will not be in order unless you add an order to the final query.
