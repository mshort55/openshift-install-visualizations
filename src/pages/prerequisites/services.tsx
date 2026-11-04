import { PrerequisiteLink } from "./interactions";
export function Services() {
  return (
    <div className="services">
      <article className="service">
        <div className="owner">T1 / T3 · Network + IPAM</div>
        <h3>Allocate &amp; connect</h3>
        <p>
          VLAN <b>130</b> · <b>10.20.30.0/24</b>
          <br />
          Gateway <b>10.20.30.1</b> · MTU <b>1500</b>
          <br />
          Reserve nodes <b>.21–.25</b>, VIPs <b>.10 / .11</b>.<br />
          Switch ports, routes and return paths ready.
        </p>
        <PrerequisiteLink target="tickets/network">
          Switch &amp; route ticket ↓
        </PrerequisiteLink>
      </article>
      <article className="service orange">
        <div className="owner">T2 · DDI / IPAM</div>
        <h3 className="dhcp-only">DHCP reservations</h3>
        <h3 className="static-only">Static address handoff</h3>
        <p className="dhcp-only">
          Reserve each NIC MAC → node IP.
          <br />
          Supply /24 mask, gateway and resolvers.
          <br />
          DHCP relay if server is off-subnet.
          <br />
          Keep VIPs out of the DHCP pool.
        </p>
        <p className="static-only">
          Allocate .21–.25 outside DHCP pools.
          <br />
          Supply /24, gateway, routes, resolvers.
          <br />
          Installer owner embeds these in the ISO.
          <br />
          No node-LAN DHCP service needed.
        </p>
        <PrerequisiteLink target="addressing">
          Compare both configurations ↓
        </PrerequisiteLink>
      </article>
      <article className="service green">
        <div className="owner">T5 · DNS / DDI</div>
        <h3>Name resolution</h3>
        <p>
          Existing resolvers <b>10.20.10.53 / .54</b>
          <br />
          Resolve registries and site services.
        </p>
        <p className="apps-pending-only">
          <span className="chip condition">Site cluster records pending</span>
          <br />
          Node API resolution is managed internally.
          <br />
          Local workstation mapping: <code>api → .10</code>.
        </p>
        <p className="published-only">
          <span className="chip optional">Client records published</span>
          <br />
          <code>api → .10</code>
          <br />
          <code>*.apps → .11</code>
        </p>
        <PrerequisiteLink target="dns">
          DNS requirements and scope ↓
        </PrerequisiteLink>
      </article>
      <article className="service purple">
        <div className="owner">T4–T6 · Security + shared services</div>
        <h3>Content &amp; time</h3>
        <p>
          NTP <b>10.20.10.123</b> · UDP 123
          <br />
          Allow release-image / registry traffic.
          <br />
          Direct HTTPS, approved proxy, or mirror.
          <br />
          Permit DNS, node traffic and admin access.
        </p>
        <PrerequisiteLink target="firewall">
          Source → destination rules ↓
        </PrerequisiteLink>
      </article>
    </div>
  );
}
