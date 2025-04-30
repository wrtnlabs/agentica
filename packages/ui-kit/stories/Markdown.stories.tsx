import type { Meta, StoryObj } from "@storybook/react";

import { Markdown } from "../src/ui/markdown";
import "../src/ui/index.css";

export default {
  title: "Markdown",
  component: Markdown,
  decorators: [],
} as Meta<typeof Markdown>;

export const Index: StoryObj<typeof Markdown> = {
  args: {
    children:
      "# Markdown Test\n"
      + "---\n"
      + "# Heading1\n"
      + "## Heading2\n"
      + "### Heading3\n"
      + "#### Heading4\n"
      + "##### Heading5\n"
      + "###### Heading6\n"
      + "---\n"
      + "# Text\n"
      + "Basic Text\n\n"
      + "**Bold**\n\n"
      + "_Italic_\n\n"
      + "~Strike Though~\n\n"
      + "> Quote\n\n"
      + "[Link](https://wrtn.ai/)\n\n"
      + "---\n"
      + "# List\n"
      + "- Bullet List1\n"
      + "- Bullet List2\n"
      + "- Bullet List3\n\n"
      + "1. Numbered List1\n"
      + "2. Numbered List2\n"
      + "3. Numbered List3\n"
      + "---\n"
      + "# Code\n"
      + "### Inline Code\n"
      + "`inline code`\n"
      + "### Code Block\n"
      + "```javascript\n"
      + "const numbers = Array(10).fill().map((_, index) => index + 1);\n"
      + "console.log(numbers);\n"
      + "```\n"
      + "---\n"
      + "# Table\n"
      + "| 데이터 타입 | 설명 |"
      + "\n"
      + "| --- | --- |"
      + "\n"
      + "| Number | 정수, 부동 소수점 숫자 등 모든 숫자 타입 |"
      + "\n"
      + "| String | 문자열 |"
      + "\n"
      + "| Boolean | true 또는 false |"
      + "\n"
      + "\n"
      + "---\n"
      + "# Image \n"
      + "![Markdown Logo](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRp9LnZ1FTSu84cFzORE4amLGI_-H1xa1HLZg&s)\n\n"
      + "---\n"
      + "# Example \n"
      + "### 지구 온난화와 미세플라스틱이 산호초에 미치는 영향 분석\n"
      + "\n"
      + "산호초는 지구 온난화와 미세플라스틱 오염으로 인해 심각한 피해를 받고 있습니다. 이에 대해 다음과 같은 실험들이 진행되었습니다:\n"
      + "\n"
      + "1. 다양한 농도의 미세플라스틱이 산호 열 스트레스 내성에 미치는 영향 실험 [[1]](about:blank)\n"
      + "2. 다양한 혼합 미세플라스틱이 산호 열 스트레스 내성에 미치는 영향 실험 [[2]](about:blank), [[3]](about:blank), [[4]](about:blank), [[5]](about:blank)\n"
      + "\n"
      + "### 미세플라스틱과 열 스트레스가 산호초에 미치는 영향\n"
      + "\n"
      + "- 실험 1에서는 미세플라스틱 농도가 높을수록 산호의 열 스트레스에 대한 내성이 감소하는 것을 확인했습니다.\n"
      + "- 실험 3에서는 섬유, 타이어 마모, 해변 유래 등 다양한 종류의 미세플라스틱 혼합물이 산호의 열 스트레스 내성을 저하시킴을 보여주었습니다.\n"
      + "\n"
      + "### 오픈소스 소프트웨어와 국가별 다양화\n"
      + "\n"
      + "최근 대규모 언어 모델(LLM)의 발전과 더불어 오픈소스 소프트웨어 개발 또한 활성화되고 있습니다. 각국의 오픈소스 소프트웨어 활용과 발전 현황을 살펴보면 다음과 같습니다:\n"
      + "\n"
      + "- 미국, 중국, 인도 등 IT 강국을 중심으로 오픈소스 소프트웨어 개발이 활발하게 진행되고 있습니다.\n"
      + "- 유럽과 일본 등 선진국에서도 오픈소스 소프트웨어 생태계가 점차 확대되고 있습니다.\n"
      + "- 개발도상국에서도 오픈소스 소프트웨어 활용이 증가하면서 국가별 특성을 반영한 다양한 프로젝트들이 등장하고 있습니다.\n"
      + "\n"
      + "종합적으로 볼 때, 지구 온난화와 미세플라스틱 오염은 산호초 생태계에 심각한 위협이 되고 있으며, 국가별로 다양한 오픈소스 소프트웨어 생태계가 발전하고 있습니다.\n"
      + "이 코드가 도움이 되셨나요? 혹시 추가로 설명이 필요하거나 다른 질문이 있으시다면 말씀해 주세요.",
  },
};
