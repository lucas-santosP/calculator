import { mount } from "@vue/test-utils";
import Button from "../../../src/components/Button.vue";

describe("Button", () => {
  it("is a vue instance", () => {
    const wrapper = mount(Button);
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should display default slot correctly", () => {
    const slotsEl = { default: "<span data-test='slot'>any element</span>" };
    const wrapperSlotEl = mount(Button, { slots: slotsEl });

    const slotsString = { default: "any text" };
    const wrapperSlotString = mount(Button, { slots: slotsString });

    expect(wrapperSlotEl.find("[data-test='slot']").exists()).toBeTruthy();
    expect(wrapperSlotString.text()).toEqual(slotsString.default);
  });

  it("should change background class based on variant props", async () => {
    const variants = [undefined, "red", "blue", "green", "yellow"];

    variants.forEach((variant) => {
      const wrapper = mount(Button, { props: { variant } });
      expect(wrapper.classes().join("")).toContain(`bg-${variant ? variant : "blue"}`);
    });
  });
});
