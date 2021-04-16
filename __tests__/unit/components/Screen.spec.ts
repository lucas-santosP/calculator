import { mount } from "@vue/test-utils";
import Screen from "../../../src/components/Screen.vue";

describe("Screen", () => {
  it("is a vue instance", () => {
    const wrapper = mount(Screen);
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should display the received text props, if no error received", () => {
    const props = { text: "any text" };
    const wrapper = mount(Screen, { props });

    expect(wrapper.find("[data-test='text']").text()).toEqual(props.text);
    expect(wrapper.find("[data-test='error']").exists()).toBeFalsy();
  });

  it("should display only a error message if the received error props is true", () => {
    const props = { error: true, text: "any text" };
    const wrapper = mount(Screen, { props });

    expect(wrapper.find("[data-test='error']").text()).toEqual("Invalid expression");
    expect(wrapper.find("[data-test='text']").exists()).toBeFalsy();
  });
});
