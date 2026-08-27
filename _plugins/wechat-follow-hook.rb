# Append the reusable WeChat follow card to every post before Liquid rendering.

Jekyll::Hooks.register :posts, :pre_render do |post|
  include_tag = '{% include wechat-follow.html %}'
  next if post.content.include?(include_tag)

  post.content = "#{post.content.rstrip}\n\n#{include_tag}\n"
end
