// Fixed product labels only. Never send DOM text or user-created titles.
(function () {
  const labels = ['日记','拾句','准备','我的','日记日历','我想说说','今天不想说话','回答问题','换一个问题','不知道说什么','添加图片','切换录音文字','发送日记','新建摘录','新建主题','说说看','保存心情','继续录音','暂时不录','开始录音','结束并保存','取消录音'];
  window.sayitPosthogOptions = {
    autocapture: {dom_event_allowlist: ['click'], css_selector_allowlist: ['button[data-ph-label]'], capture_copied_text: false},
    mask_all_text: true,
    disable_session_recording: true,
    capture_exceptions: false,
    rageclick: false,
    before_send: function (event) {
      if (!event || event.event !== '$autocapture') return event;
      const props = event.properties || {};
      const elements = props.$elements || [];
      const target = elements.find(function (el) { return labels.includes(el['attr__data-ph-label']); });
      const chainLabel = String(props.$elements_chain || '').match(/attr__data-ph-label="([^"]+)"/);
      const label = target ? target['attr__data-ph-label'] : chainLabel && chainLabel[1];
      if (!labels.includes(label) || props.$event_type !== 'click') return null;
      Object.keys(props).forEach(function (key) {
        if (key.startsWith('$el') || key.startsWith('attr__')) delete props[key];
      });
      props.$elements = [{tag_name: 'button', $el_text: label}];
      props.$elements_chain = 'button:text="' + label + '"';
      props.button_name = label;
      return event;
    }
  };
})();
