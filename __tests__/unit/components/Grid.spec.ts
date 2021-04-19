import { mount } from "@vue/test-utils";
import Grid from "../../../src/components/Grid.vue";

describe("Grid", () => {
  it("is a vue instance", () => {
    const props = { rows: 2, cols: 4 };
    const wrapper = mount(Grid, { props });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should display default slot correctly", () => {
    const props = { rows: 2, cols: 4 };
    const slotsEl = { default: "<span data-test='slot'>any element</span>" };
    const wrapperSlotEl = mount(Grid, { props, slots: slotsEl });
    const slotsString = { default: "any text" };
    const wrapperSlotString = mount(Grid, { props, slots: slotsString });

    expect(wrapperSlotEl.find("[data-test='slot']").exists()).toBeTruthy();
    expect(wrapperSlotString.text()).toEqual(slotsString.default);
  });

  it("should add correctly classes based on the received props", () => {
    const props = { rows: 2, cols: 4, gap: 4 };
    const wrapper = mount(Grid, { props });

    expect(wrapper.classes().join(" ")).toContain(
      `grid grid-rows-${props.rows} grid-cols-${props.cols} gap-${props.gap}`
    );
  });
});
