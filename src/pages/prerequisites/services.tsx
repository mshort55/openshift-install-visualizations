import { PrerequisiteLink } from "./interactions";

export function Services() {
  return (
    <div className="services">
      <article className="service">
        <h3>Gateway</h3>
        <p>
          <b>10.20.30.1</b>
          <br />
          Routes and return paths to site services.
        </p>
        <PrerequisiteLink target="tickets/network">
          Network handoff →
        </PrerequisiteLink>
      </article>
      <article className="service green">
        <h3>DNS</h3>
        <p>
          <b>10.20.10.53 / .54</b>
          <br />
          Resolvers for registry and site names.
        </p>
        <PrerequisiteLink target="dns">DNS handoff →</PrerequisiteLink>
      </article>
      <article className="service orange">
        <h3>Time</h3>
        <p>
          <b>10.20.10.123</b>
          <br />
          NTP · UDP 123
        </p>
        <PrerequisiteLink target="tickets/services">
          Time-source handoff →
        </PrerequisiteLink>
      </article>
      <article className="service purple">
        <h3>Release images</h3>
        <p>Registry, approved proxy or mirror.</p>
        <PrerequisiteLink target="tickets/content">
          Content-access handoff →
        </PrerequisiteLink>
      </article>
    </div>
  );
}
