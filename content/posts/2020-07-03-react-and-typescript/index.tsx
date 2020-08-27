import * as React from "react";

class Test extends React.Component<{ Comp: React.ComponentType }> {
    render() {
        const el: React.ReactElement = <this.props.Comp />;
        return <>{el}</>
    }
}

const Forwarded = React.forwardRef<{}>((props, ref) => {
    return <Test ref={ref} Component={() => null} />;
});
