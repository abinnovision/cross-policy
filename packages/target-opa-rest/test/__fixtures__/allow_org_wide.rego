package allow_org_wide
import future.keywords

# Deny per default.
default allow := false

allow if {
	input.config.organization != null
	input.config.organization != ""

	# The target and caller must be in the configure organization.
	input.caller.owner == input.config.organization
	input.target.owner == input.config.organization
}

