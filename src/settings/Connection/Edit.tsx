import React from 'react'
import { RiArrowLeftLine, RiDeleteBinLine } from 'react-icons/ri'

import { Box, Button, Field, Flex, IconButton, Select } from '../../components'
import {
  useConnection,
  useConnections,
  useSelectedConnectionId,
} from '../connectionHooks'
import useConnectionDryRun from '../useConnectionDryRun'

import ConnectButton from './ConnectButton'
import classes from './style.module.css'
import { useSafeModuleInfo } from './useSafeModuleInfo'

type ConnectionPatch = {
  label?: string
  avatarAddress?: string
  moduleAddress?: string
  roleId?: string
}

const EditConnection: React.FC<{ onLaunch(): void }> = ({ onLaunch }) => {
  const [connections, setConnections] = useConnections()
  const [, setSelectedConnectionId] = useSelectedConnectionId()
  const { connection, connected } = useConnection()

  const { label, avatarAddress, moduleAddress, roleId } = connection
  const { loading, isValidSafe, enabledModules } =
    useSafeModuleInfo(avatarAddress)

  const validatedModuleAddress =
    moduleAddress && enabledModules.includes(moduleAddress) ? moduleAddress : ''

  const updateConnection = (patch: ConnectionPatch) => {
    setConnections(
      connections.map((c) =>
        c.id === connection.id ? { ...connection, ...patch } : c
      )
    )
  }
  const removeConnection = () => {
    const newConnections = connections.filter((c) => c.id !== connection.id)
    setConnections(newConnections)
  }

  const error = useConnectionDryRun(connection)

  const canLaunch =
    connected &&
    !error &&
    connection.moduleAddress &&
    connection.avatarAddress &&
    connection.roleId

  return (
    <Flex direction="column" gap={3}>
      <Flex direction="row" gap={2}>
        <Flex direction="column" gap={3}>
          <IconButton onClick={() => setSelectedConnectionId('')}>
            <RiArrowLeftLine size={24} title="Select another connection" />
          </IconButton>

          <IconButton
            onClick={removeConnection}
            disabled={connections.length === 1}
            danger
          >
            <RiDeleteBinLine size={24} title="Remove this connection" />
          </IconButton>
        </Flex>
        <Flex direction="column" gap={3} className={classes.form}>
          <input
            type="text"
            value={label}
            placeholder="Label this connection"
            onChange={(ev) => {
              updateConnection({
                label: ev.target.value,
              })
            }}
          />
          <Field>
            <ConnectButton />
          </Field>
          <Field label="DAO Safe">
            <input
              type="text"
              value={avatarAddress}
              onChange={(ev) => {
                updateConnection({
                  avatarAddress: ev.target.value,
                  moduleAddress: '',
                })
              }}
            />
          </Field>
          <Field label="Zodiac Modifier or Module Address">
            <Select
              options={enabledModules.map((address) => ({
                value: address,
                label: address,
              }))}
              onChange={(selected) => {
                updateConnection({
                  moduleAddress: (selected as { value: string; label: string })
                    .value,
                })
              }}
              value={
                validatedModuleAddress
                  ? {
                      value: validatedModuleAddress,
                      label: validatedModuleAddress,
                    }
                  : ''
              }
              isDisabled={loading || !isValidSafe}
              placeholder={loading || !isValidSafe ? '' : 'Select a module'}
              noOptionsMessage={() => 'No modules are enabled on this Safe'}
            />
          </Field>
          <Field label="Role ID">
            <input
              type="text"
              value={roleId}
              onChange={(ev) => {
                updateConnection({ roleId: ev.target.value })
              }}
              placeholder="0"
            />
          </Field>
        </Flex>
      </Flex>
      {error && (
        <>
          <div>There seems to be a problem with this connection:</div>
          <Box p={3} className={classes.error}>
            {error}
          </Box>
        </>
      )}

      <Button
        disabled={!canLaunch}
        onClick={() => {
          onLaunch()
        }}
      >
        Launch
      </Button>
    </Flex>
  )
}

export default EditConnection